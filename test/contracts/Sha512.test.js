import chai, {expect} from 'chai';
import { ethers, utils } from 'ethers';
import MD5 from 'crypto-js/md5';
import CryptoJS from 'crypto-js';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';

import Sha512 from '../../build/Sha512';

chai.use(solidity);

describe('Sha512 contracts test', async () => {
  let provider;
  let accounts;
  let wallet;
  let anotherWallet;
  let contract;

  beforeEach(async () => {
    provider = await createMockProvider({ gasLimit: 8000000000 });
    accounts = await getWallets(provider);
    [wallet, anotherWallet] = accounts;
    contract = await deployContract(wallet, Sha512, [], { gasLimit: 100000000 });
  });

  describe("function preprocess" , async() => {

    it("expect to be a function", async () => {
      expect(contract.preprocess).to.be.an('function');
    });

    it("expect to return preprocessed 'hello world'", async () => {
      expect(
        await contract.preprocess("0x48656c6c6f20576f726c64")
      ).to.be.eq("0x90cad8d8de40aedee4d8c90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b");
    });

  });

  describe("function rotateL" , async() => {

    it("expect to be a function", async () => {
      expect(contract.rotateL).to.be.an('function');
    });

    it("expect to shift to left 1", async () => {
      let result = await contract.rotateL(1, 1);
      expect(result).to.be.eq(2);
    });    

    it("expect to shift to left 2", async () => {
      let result = await contract.rotateL(1, 2);
      expect(result).to.be.eq(4);
    }); 

    it("expect to shift to left 3", async () => {
      let result = await contract.rotateL(1, 3);
      expect(result).to.be.eq(8);
    }); 

    it("expect to shift to left 4", async () => {
      let result = await contract.rotateL(1, 4);
      expect(result).to.be.eq(16);
    }); 

    it("expect to shift to left 1 on 255", async () => {
      let result = await contract.rotateL(255, 1);
      expect(result).to.be.eq(637);
    }); 

  });

  describe("function rotateR" , async() => {

    it("expect to be a function", async () => {
      expect(contract.rotateR).to.be.an('function');
    });

    it("expect to shift to right 1", async () => {
      let result = await contract.rotateR(1, 1);
      expect(result).to.be.eq("9223372036854775808");
    });    

    it("expect to shift to right 2", async () => {
      let result = await contract.rotateR(1, 2);
      expect(result).to.be.eq("4611686018427387904");
    }); 

    it("expect to shift to right 3", async () => {
      let result = await contract.rotateR(1, 3);
      expect(result).to.be.eq("2305843009213693952");
    }); 

    it("expect to shift to right 4", async () => {
      let result = await contract.rotateR(1, 4);
      expect(result).to.be.eq("1152921504606846976");
    }); 

    it("expect to shift to right 5", async () => {
      let result = await contract.rotateR(1, 5);
      expect(result).to.be.eq("576460752303423488");
    }); 

    it("expect to shift to right 5", async () => {
      let result = await contract.rotateR(255, 1);
      expect(result).to.be.eq("9223372036854775935");
    }); 

  });

  describe("function getBlock" , async() => {

    it("expect to be a function", async () => {
      expect(contract.getBlock).to.be.an('function');
    });

    it("expect to return a block1", async () => {
      let result = await contract.getBlock("0xe8cae6e8cb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005", 0);
      expect(result[0]).to.be.eq("548083200");
      expect(result[1]).to.be.eq("0");
    });    

    it("expect to return a block2", async () => {
      let result = await contract.getBlock("0xe8cae6e8cb000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005", 0);
      expect(result[0]).to.be.eq("548083200");
      expect(result[1]).to.be.eq("1");
    });   

    it("expect to return a block3", async () => {
      let result = await contract.getBlock("0x0000000000000001000000000000000100000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005", 0);
      expect(result[0]).to.be.eq("1");
      expect(result[1]).to.be.eq("1");
    });    

  });

  describe("function digest" , async() => {

    it("expect to be a function", async () => {
      expect(contract.digest).to.be.an('function');
    });

    it("expect to hash has 64bits(512 bits)", async () => {
      let result = await contract.digest("0x48656c6c6f20576f726c64");
      expect(
        result.reduce((prev,e) => prev + e._hex.replace('0x',''), "0x").length
      ).to.be.eq(130); // 128 char in hexadecimal + '0x'
    });

    it("expect to return digest 'hello world'", async () => {
      let result = await contract.digest("0x48656c6c6f20576f726c64");
      expect(
        result.reduce((prev,e) => prev + e._hex.replace('0x',''), "0x")
      ).to.be.eq("0x309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f");
    });

  });

});



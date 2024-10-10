import dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27", 
  sourcify: {
    enabled: true
  },
  etherscan:{
    apiKey: process.env.API_KEY_ETHERSCAN
  },
  defaultNetwork: "local",
  networks:{
    local:{
      url:"http://127.0.0.1:8545",
      chainId: 31337,
      accounts:{
        mnemonic: "test test test test test test test test test test test junk"
      }
    },
    sepolia:{
      url: process.env.INFURA_URL,
      chainId: 11155111,
      accounts:{
        mnemonic: process.env.SECRET,
        
      }

    },
    bsctest:{
      url: process.env.BSC_URL_TEST,
      chainId: 97,
      accounts:{
        mnemonic: process.env.SECRET,
        
      }

    },
    bscprod:{
      url: process.env.BSC_URL_PROD,
      chainId: 56,
      accounts:{
        mnemonic: process.env.SECRET,
        
      }

    }
  }
};

export default config;

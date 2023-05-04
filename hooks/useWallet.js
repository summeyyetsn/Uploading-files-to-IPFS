import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const useWallet = () => {
  const [address, setAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [chainId, setChainId] = useState(undefined);

  let provider, signer;
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  }

  const connect = useCallback(async () => {
    const [account] = await provider.send("eth_requestAccounts", []);
    setAddress(account);
    setIsConnecting(false);
  }, [provider]);

  const getCurrentNetworkAccount = useCallback(async () => {
    const network = await provider.getNetwork();
    const [account] = await provider.send("eth_accounts", []);
    if (!account || !network) return;
    setAddress(account);
    setChainId(network.chainId);
    setIsConnecting(false);
  }, [provider]);

  const changeAccount = useCallback(() => {
    provider.send("wallet_requestPermissions", [{ eth_accounts: {} }]);
  }, [provider]);

  useEffect(() => {
    getCurrentNetworkAccount();

    window.ethereum.on("accountsChanged", (accounts) => {
      setAddress(accounts[0]);
    });

    window.ethereum.on("chainChanged", (chainId) => {
      setChainId(Number(chainId));
    });

    return () => {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined" &&
        typeof window.ethereum.off === "function"
      ) {
        window.ethereum.off("accountsChanged");
        window.ethereum.off("chainChanged");
      }
    };
  }, []);

  return {
    wallet: {
      address,
      changeAccount,
      connect,
      isConnecting,
      chainId,
    },
  };
};

export default useWallet;

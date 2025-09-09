/* eslint-disable @next/next/no-img-element */
"use client";
import {
  ConnectButton,
  useAccount,
  useWallets,
  useDisconnect,
} from "@particle-network/connectkit";
import { useState, useEffect } from "react";
// Universal Accounts imports
import {
  UniversalAccount,
  type IAssetsResponse,
  CHAIN_ID,
  SUPPORTED_TOKEN_TYPE,
} from "@particle-network/universal-account-sdk";
import { Interface, parseUnits } from "ethers";

const App = () => {
  // Get wallet from Particle Connect
  const [primaryWallet] = useWallets();
  const walletClient = primaryWallet?.getWalletClient();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [universalAccountInstance, setUniversalAccountInstance] =
    useState<UniversalAccount | null>(null);
  const [accountInfo, setAccountInfo] = useState<{
    ownerAddress: string;
    evmSmartAccount: string;
    solanaSmartAccount: string;
  } | null>(null);

  // Format address to show truncated version
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // === Initialize UniversalAccount ===
  useEffect(() => {
    if (isConnected && address) {
      // Create new UA instance when user connects
      const ua = new UniversalAccount({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        projectClientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        projectAppUuid: process.env.NEXT_PUBLIC_APP_ID!,
        ownerAddress: address,
      });
      setUniversalAccountInstance(ua);
    } else {
      // Reset UA when user disconnects
      setUniversalAccountInstance(null);
    }
  }, [isConnected, address]);

  // === Fetch Universal Account Addresses ===
  useEffect(() => {
    if (!universalAccountInstance || !address) return;
    const fetchSmartAccountAddresses = async () => {
      // Get Universal Account addresses for both EVM and Solana
      const options = await universalAccountInstance.getSmartAccountOptions();
      setAccountInfo({
        ownerAddress: address, // EOA address
        evmSmartAccount: options.smartAccountAddress || "", // EVM Universal Account
        solanaSmartAccount: options.solanaSmartAccountAddress || "", // Solana Universal Account
      });
      console.log("Universal Account Options:", options);
    };
    fetchSmartAccountAddresses();
  }, [universalAccountInstance, address]);

  // Aggregated balance across all chains
  const [primaryAssets, setPrimaryAssets] = useState<IAssetsResponse | null>(
    null
  );
  const [txResult, setTxResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for USDC transfer form
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("1");

  const runTransaction = async () => {
    if (!universalAccountInstance || !recipientAddress) return;
    setIsLoading(true);
    setTxResult(null);

    // USDC contract address on Arbitrum
    const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

    // USDC uses 6 decimals
    const amount6 = parseUnits(amount, 6);

    try {
      // ERC-20 transfer ABI
      const erc20Interface = new Interface([
        "function transfer(address to, uint256 amount) external returns (bool)",
      ]);

      // Create universal transaction (chain-agnostic)
      const transaction =
        await universalAccountInstance.createUniversalTransaction({
          chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE, // use the enum value from your SDK
          // Ensure this much USDC exists on Arbitrum before executing
          expectTokens: [
            {
              type: SUPPORTED_TOKEN_TYPE.USDC,
              amount, // human-readable string e.g. "12.34"
            },
          ],
          transactions: [
            {
              to: USDC_ADDRESS,
              data: erc20Interface.encodeFunctionData("transfer", [
                recipientAddress,
                amount6,
              ]),
              //value: "0x0", // no native value for ERC-20 transfer
            },
          ],
        });

      // Sign and send transaction
      const signature = await walletClient?.signMessage({
        account: address as `0x${string}`,
        message: { raw: transaction.rootHash },
      });

      const result = await universalAccountInstance.sendTransaction(
        transaction,
        signature
      );

      setTxResult(
        `https://universalx.app/activity/details?id=${result.transactionId}`
      );
    } catch (error) {
      console.error("Transaction failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setTxResult(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // === Fetch Primary Assets ===
  useEffect(() => {
    if (!universalAccountInstance || !address) return;
    const fetchPrimaryAssets = async () => {
      // Get aggregated balance across all chains
      // This includes ETH, USDC, USDT, etc. on various chains
      const assets = await universalAccountInstance.getPrimaryAssets();
      setPrimaryAssets(assets);
    };
    fetchPrimaryAssets();
  }, [universalAccountInstance, address]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0A0A1A] to-[#1A0A2A] p-4 font-sans">
      {/* Main container */}
      <div className="w-full max-w-md bg-[#1F1F3A] rounded-xl shadow-lg p-6 space-y-6 border border-[#3A3A5A]">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="https://pbs.twimg.com/profile_images/1623919818108997633/o2JfMaqi_400x400.png"
            alt="Particle Network Logo"
            className="h-12 w-12"
          />
          <h1 className="text-3xl font-bold text-[#C084FC] text-center">
            Ultimate Universal App
          </h1>
          <p className="text-sm text-gray-400 text-center">
            Build the ultimate chain-agnostic dApp with Universal Accounts. Find
            the repo on{" "}
            <a
              href="https://github.com/particle-network/ultimate-universal-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C084FC] hover:underline"
            >
              GitHub
            </a>{" "}
            and contribute!
          </p>
        </div>

        {/* Connected State */}
        {isConnected ? (
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-[#2A2A4A] rounded-lg p-4 border border-[#3A3A5A]">
              <h3 className="text-md font-medium text-gray-200 mb-3">
                Account Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Wallet:</span>
                  <span className="font-mono text-gray-200 ml-2">
                    {formatAddress(address as string)}
                  </span>
                </div>
                {accountInfo && (
                  <>
                    <div>
                      <span className="text-gray-400">
                        EVM Universal Account:
                      </span>
                      <span className="font-mono text-gray-200 ml-2">
                        {formatAddress(accountInfo.evmSmartAccount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">
                        Solana Universal Account:
                      </span>
                      <span className="font-mono text-gray-200 ml-2">
                        {formatAddress(accountInfo.solanaSmartAccount)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Balance */}
            <div className="bg-[#2A2A4A] rounded-lg p-4 border border-[#3A3A5A] text-center">
              <h3 className="text-md font-medium text-gray-200 mb-1">
                Universal Balance
              </h3>
              <p className="text-2xl font-bold text-[#FACC15]">
                ${primaryAssets?.totalAmountInUSD.toFixed(2) || "0.00"}
              </p>
            </div>

            {/* Transfer Form */}
            <div className="bg-[#2A2A4A] rounded-lg p-4 border border-[#3A3A5A]">
              <h3 className="text-md font-medium text-gray-200 mb-3 text-center">
                Send USDC
              </h3>
              <span className="text-gray-400 text-sm">
                Send USDC to any address on Arbitrum, even if you don&apos;t
                hold any USDC or funds on Arbitrum.
              </span>
              <div className="space-y-3 mt-4">
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Recipient Address (0x...)"
                  className="w-full px-3 py-2 bg-[#1A1A3A] border border-[#3A3A5A] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FACC15]"
                />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  min="0.000001"
                  step="0.000001"
                  className="w-full px-3 py-2 bg-[#1A1A3A] border border-[#3A3A5A] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FACC15]"
                />
                <button
                  onClick={runTransaction}
                  disabled={isLoading || !recipientAddress}
                  className="w-full py-2 rounded-md font-medium text-gray-900 bg-gradient-to-r from-[#FACC15] to-[#EAB308] hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send USDC"}
                </button>
              </div>
              {txResult && (
                <div className="mt-3 text-center text-sm">
                  {txResult.startsWith("Error") ? (
                    <p className="text-red-400">{txResult}</p>
                  ) : (
                    <a
                      href={txResult}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      View Transaction
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Disconnect Button */}
            <div className="flex justify-center">
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 py-4">
            <p className="text-gray-400 text-center">
              Connect your wallet to view account details
            </p>
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

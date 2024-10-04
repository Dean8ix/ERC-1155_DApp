import ABI from "../artifacts/contracts/Airdrop.sol/Airdrop.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [walletAddress, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenValue, setTokenValue] = useState("");
  const [idType, setIdType] = useState("");
  const [toAdd, setToAdd] = useState("");
  const [balAdd, setBalAdd] = useState("");
  const [balId, setBalId] = useState("");
  const [balance, setBalance] = useState("");
  const [formVisible, setFormVisible] = useState("");

  const CONTRACT_ADDRESS = "0x09D7E902B2d5E9421e6Fb7e9e7A98069a0252216";

  //===============================================

  const walletCheck = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      accountRequest(account);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      toast.error("Install Metamask extension");
      return;
    }

    if (walletAddress) {
      setAccount(null);
      setContract(null);
      return;
    }

    accountRequest(await ethWallet.request({ method: "eth_requestAccounts" }));

    const provider = new ethers.providers.Web3Provider(ethWallet);

    const smartContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI.abi,
      provider.getSigner()
    );
    setContract(smartContract);
  };

  const accountRequest = (account) => {
    if (account) {
      setAccount(account[0]);
    } else {
      toast.error("No account found!");
    }
  };

  //=============================================================================

  const signUp = async () => {
    if (contract) {
      try {
        const signTx = await contract.signUp();

        await signTx.wait();

        toast.success(`
            signed up successfully
          `);
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    } else {
      toast.error("Connect Wallet to transact!");
    }
  };

  const airdrop = async (to, id, val) => {
    if (contract) {
      try {
        const airdropTx = await contract.airdrop(to, id, val);

        await airdropTx.wait();

        toast.success(`
            Success!
          `);
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    } else {
      toast.error("Connect Wallet to transact!");
    }
  };

  const balanceOf = async (_acct, _id) => {
    if (contract) {
      try {
        const balTx = await contract.balanceOf(_acct, _id);
        setBalance(balTx);
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    } else {
      toast.error("Connect Wallet to transact!");
    }
  };

  useEffect(() => {
    walletCheck();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <button onClick={connectAccount} className="connect-btn">
          {walletAddress
            ? `${walletAddress.substring(0, 10)}...${walletAddress.substring(
                32
              )}`
            : "Connect Wallet"}
        </button>
      </header>
      <div className="buttons-container">
        <h1 className="title">Airdrop DApp</h1>

        <div className="card">
          {/* signUp */}
          <div>
            <button onClick={() => signUp()}>Sign Up</button>
          </div>

          <div className="separator"></div>

          {/* Withdrawal */}
          <div>
            <button onClick={() => setFormVisible("airdrop")}>Airdrop</button>
            {formVisible === "airdrop" && (
              <form
                className="function-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  airdrop(toAdd, idType, tokenValue);
                }}
              >
                <input
                  type="text"
                  placeholder="Address"
                  value={toAdd}
                  onChange={(e) => setToAdd(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Token Id"
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Value"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
          <div className="separator"></div>

          {/* Balance_of */}
          <div>
            <button onClick={() => setFormVisible("balance_of")}>
              Get Balance
            </button>
            {formVisible === "balance_of" && (
              <form
                className="function-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  balanceOf(balAdd, balId);
                }}
              >
                <input
                  type="text"
                  placeholder="Enter address"
                  value={balAdd}
                  onChange={(e) => setBalAdd(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter Id"
                  value={balId}
                  onChange={(e) => setBalId(e.target.value)}
                />
                <button type="submit">Submit</button>

                <h2 className="outputs">{`${balance ? balance : " "}`}</h2>
              </form>
            )}
          </div>

          <div className="separator"></div>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </div>
      <style jsx>{`
        /* Global App Styles */
        body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #515b8a, #a97dd4);
          font-family: "Poppins", sans-serif;
          padding: 2rem;
          margin: 0;
        }

        .header {
          position: fixed;
          top: 0;
          right: 0;
          padding: 10px 20px;
          z-index: 1000;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          background-color: #0077cc;
        }

        .connect-btn {
          background-color: white;
          color: #0077cc;
          border: 2px solid #0077cc;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .connect-btn:hover {
          background-color: #005fa3;
          color: white;
        }

        .buttons-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 80px; /* Push the buttons down a bit */
        }

        .buttons-container button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 15px;
          font-size: 16px; /* Increase font size for buttons */
          border-radius: 8px; /* Rounder buttons */
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 100%; /* Make buttons take full width of parent container */
          max-width: 300px; /* Ensure buttons are the same width as form inputs */
        }

        .title {
          color: linear-gradient(135deg, #515b8a, #a97dd4);
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .card {
          background-color: #ffffff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          border: 2px solid #0077cc;
          max-width: 400px;
          width: 100%;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 20px 0;
        }

        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
        }

        .separator {
          width: 100%;
          height: 1px;
          background-color: #ccc;
          margin: 20px 0;
        }

        .function-form {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: center;
        }

        .function-form input {
          padding: 12px;
          border-radius: 8px;
          border: 2px solid #0077cc;
          font-size: 16px;
          width: 100%;
          max-width: 300px;
          text-align: center;
        }

        .function-form button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 12px 18px;
          font-size: 16px;
          border-radius: 10px;
          cursor: pointer;
          width: 100%;
          max-width: 300px;
          transition: background-color 0.3s ease;
        }

        .function-form button:hover {
          background-color: #218838;
        }

        .outputs {
          margin-top: 20px;
          color: #333;
          font-size: 1.2rem;
          word-wrap: break-word;
          white-space: normal;
          max-width: 100%;
          overflow-wrap: break-word;
        }
      `}</style>
      ;
    </div>
  );
}

export default App;

"use client";
import { ConnectMultiButton, useWalletAddress } from "bitcoin-wallet-adapter";
import InnerMenu from "./InnerMenu";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setBtcPrice, setUser } from "@/stores/reducers/generalReducer";
import { getBTCPriceInDollars } from "@/utils";
import { useRouter } from "next/navigation";

const WalletButton = () => {
  const walletDetails = useWalletAddress();
  const dispatch = useDispatch();
  const router= useRouter();

  const putBTCPriceInRedux = useCallback(async () => {
    try {
      const btc = await getBTCPriceInDollars();
      console.log(btc, "btc inside");
      dispatch(setBtcPrice(btc));
    } catch (error) {
      console.error("Failed to fetch BTC price", error);
    }
  }, [dispatch]);

  useEffect(() => {
    putBTCPriceInRedux();
  }, [putBTCPriceInRedux]);

  const putUserDataInRedux = useCallback(() => {
    console.log(walletDetails, "wallet-details changed");
    if (walletDetails) {
      console.log("setting user as: ", walletDetails.cardinal_address);
      dispatch(setUser(walletDetails));
    } else {
      dispatch(setUser(null));
    }
  }, [walletDetails, dispatch]);

  useEffect(() => {
    putUserDataInRedux();
  }, [walletDetails, putUserDataInRedux]);

  useEffect(() => {
    const getData = async () => {
      try {
        const body = {
          wallet: walletDetails?.wallet,
          cardinal_address: walletDetails?.cardinal_address,
          ordinal_address: walletDetails?.ordinal_address,
          cardinal_pubkey: walletDetails?.cardinal_pubkey,
        };

        console.log(body, "---------------------------");

        if (
          walletDetails &&
          walletDetails.connected &&
          walletDetails.ordinal_address
        ) {
          const ordinal_address = walletDetails?.ordinal_address;
          // const response = await getRunes(walletDetails);
        }
      } catch (error) {
        console.error("Error :", error);
      }
    };

    if (walletDetails) {
      getData();
      router.push("/admin/dashboard")
    }
  }, [walletDetails]);

  return (
    <div className="mt-2">
      <ConnectMultiButton
          modalContentClass="bg-primary border rounded-xl border-purple-800 overflow-hidden relative lg:p-16 md:p-12 p-6"
          buttonClassname={`text-white [text-wrap:nowrap] text-sm font-bold rounded flex items-center px-4 h-[40px] py-1 ${
            walletDetails
              ? '  font-bold bg-purple-800 '
              : ' font-light bg-purple-600'
          }`}
          headingClass="text-center text-white pt-2 pb-2 text-3xl capitalize font-bold mb-4"
          walletItemClass="w-full bg-pruple-700 my-3 hover:border-purple-800 border border-transparent cursor-pointer"
          walletLabelClass="text-lg text-white capitalize tracking-wider"
          walletImageClass="w-[30px]"
          //@ts-ignore
          InnerMenu={InnerMenu}
          icon="/logo_default.png"
          iconClass="w-40 pb-8"
          // balance={balanceData?.balance}
        />
    </div>
  );
};

export default WalletButton;


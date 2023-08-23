import { useState, useEffect, useCallback } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@wallet/utils/web3";
import { useNetwork } from "@wallet/context/Network";
import { useInvokeMethod } from "./useInvokeMethod";
import { useErrorNotifier } from "./useErrorNotifier";
import { useTxToast } from "./useTxToast";
import DateLib from "@date/DateLib";
import { isGreater } from "@utils/functions/bn";
import { getInfo as getVaultInfo } from "@utils/helpers/vault/info";

const defaultInfo = {
  withdrawalOpen: "0",
  withdrawalClose: "0",
  totalReassurance: "0",
  vault: "",
  stablecoin: "",
  podTotalSupply: "0",
  myPodBalance: "0",
  vaultStablecoinBalance: "0",
  amountLentInStrategies: "0",
  myShare: "0",
  myUnrealizedShare: "0",
  totalLiquidity: "0",
};

export const useMyLiquidityInfo = ({ coverKey }: { coverKey: string }) => {
  const [info, setInfo] = useState(defaultInfo);

  const { library, account } = useWeb3React<any>();
  const { networkId } = useNetwork();
  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  const fetchInfo = useCallback(async () => {
    if (!networkId || !account || !coverKey) {
      return;
    }

    const handleError = (err: any) => {
      notifyError(err, "get vault info");
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const data = await getVaultInfo(
        networkId,
        coverKey,
        account,
        signerOrProvider.provider
      );

      return {
        withdrawalOpen: data.withdrawalStarts,
        withdrawalClose: data.withdrawalEnds,
        totalReassurance: data.totalReassurance,
        vault: data.vault,
        stablecoin: data.stablecoin,
        podTotalSupply: data.podTotalSupply,
        myPodBalance: data.myPodBalance,
        vaultStablecoinBalance: data.vaultStablecoinBalance,
        amountLentInStrategies: data.amountLentInStrategies,
        myShare: data.myShare,
        myUnrealizedShare: data.myUnrealizedShare,
        totalLiquidity: data.totalLiquidity,
      };
    } catch (err) {
      handleError(err);
    }
  }, [account, coverKey, library, networkId, notifyError]);

  useEffect(() => {
    let ignore = false;

    fetchInfo()
      .then((_info) => {
        if (ignore || !_info) return;
        setInfo(_info);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [fetchInfo]);

  const updateInfo = useCallback(() => {
    fetchInfo()
      .then((_info) => {
        if (!_info) return;
        setInfo(_info);
      })
      .catch(console.error);
  }, [fetchInfo]);

  const accrueInterest = async () => {
    const handleError = (err: any) => {
      notifyError(err, "accrue interest");
    };

    try {
      const signerOrProvider = getProviderOrSigner(
        library,
        account ?? "",
        networkId
      );

      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      );

      const onTransactionResult = async (tx: any) => {
        await txToast.push(tx, {
          pending: "Accruing intrest",
          success: "Accrued intrest successfully",
          failure: "Could not accrue interest",
        });
      };

      const onRetryCancel = () => {};
      const onError = (err: any) => {
        handleError(err);
      };

      invoke({
        instance,
        methodName: "accrueInterest",
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
    }
  };

  const now = DateLib.unix();
  const isWithdrawalWindowOpen =
    account &&
    isGreater(now, info.withdrawalOpen) &&
    isGreater(info.withdrawalClose, now);

  return {
    info,

    isWithdrawalWindowOpen: isWithdrawalWindowOpen,
    accrueInterest,

    refetch: updateInfo,
  };
};

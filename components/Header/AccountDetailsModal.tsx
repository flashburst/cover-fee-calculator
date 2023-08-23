import * as Dialog from "@radix-ui/react-dialog";
import { wallets } from "@wallet/config/wallets";
import { getAddressLink } from "@wallet/utils/explorer";
import Identicon from "./Identicon";
import { useEffect, useState } from "react";
import { CloseIcon, CopyIcon, OpenInNewIcon, CheckCircleIcon } from "@svg";
import { Modal } from "@modal/Modal";
import { Toggle } from "@components/common/Toggle";
import { useUnlimitedApproval } from "@wallet/context/UnlimitedApproval";
import { ModalWrapper } from "@modal/ModalWrapper";

const CopyAddressComponent = ({ account }: { account: string }) => {
  const [copyAddress, setCopyAddress] = useState(false);

  const timeOut = () =>
    setTimeout(() => {
      setCopyAddress(false);
    }, 1000);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(account);
    setCopyAddress(true);
    timeOut();
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeOut());
    };
  }, []);

  return (
    <div className="flex items-center cursor-pointer" onClick={handleCopy}>
      {!copyAddress ? (
        <>
          <CopyIcon className="w-4 h-4 text-999BAB" />
          <span className="text-[#21AD8C] text-xs tracking-normal ml-2.5">
            Copy Address
          </span>
        </>
      ) : (
        <>
          <CheckCircleIcon className="w-4 h-4 text-999BAB" />
          <span className="text-[#21AD8C] text-xs tracking-normal ml-2.5">
            Copied
          </span>
        </>
      )}
    </div>
  );
};

export const AccountDetailsModal = ({
  isOpen,
  onClose,
  networkId,
  handleDisconnect,
  account,
}: {
  isOpen: boolean;
  onClose: Function;
  networkId: any;
  handleDisconnect: Function;
  account: string;
}) => {
  const network = wallets.find((x) => x.id == "1");
  const { unlimitedApproval, setUnlimitedApproval } = useUnlimitedApproval();

  return (
    <Modal isOpen={isOpen} onClose={onClose} overlayClass="backdrop-blur-sm">
      <ModalWrapper className="max-w-xs px-6 py-4 my-8 overflow-y-auto transition-all sm:py-12 sm:px-16 sm:max-w-xl">
        <Dialog.Title
          // as="h3"
          className="font-bold leading-9 text-black font-sora text-heading"
        >
          Account
        </Dialog.Title>

        <button
          onClick={(e) => onClose(e)}
          className="absolute flex items-center justify-center text-black rounded-md top-5 right-6 sm:top-7 sm:right-12 hover:text-text-prim focus:text-text-prim focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-transparent"
        >
          <span className="sr-only">Close</span>
          <CloseIcon width={24} height={24} />
        </button>

        <div className="p-4 bg-white border mt-7 border-divider-gray rounded-big">
          <div className="flex flex-col-reverse items-center justify-between sm:flex-row">
            <span className="flex items-center text-xs tracking-normal text-[#364253] whitespace-nowrap">
              <span>Connected With {network?.name}</span>
              <span className="ml-2">
                {network?.Icon && <network.Icon width={12} height={12} />}
              </span>
            </span>
            <button
              onClick={(e) => handleDisconnect(e)}
              className="px-2 py-1 mb-2 border rounded-lg border-text-prim sm:mb-0 sm:ml-28 text-xxs text-text-prim"
            >
              Disconnect
            </button>
          </div>

          <div className="flex items-center justify-center mt-1 font-bold sm:mt-3 font-sora text-[#404040] sm:justify-start">
            {account ? <Identicon /> : <div />}
            <div className="ml-3">
              {account?.substring(0, 6) + "..." + account?.slice(-4)}
            </div>
          </div>

          <div className="flex flex-col items-center py-2 sm:items-start sm:flex-row">
            <CopyAddressComponent account={account ?? ""} />
            <a
              href={getAddressLink(networkId, account)}
              target="_blank"
              rel="noreferrer nofollow"
              className="flex items-center ml-3.5 cursor-pointer sm:ml-6"
            >
              <OpenInNewIcon width={16} height={16} fill="#999BAB" />
              <span className="text-[#21AD8C] text-xs tracking-normal ml-2.5">
                View on Explorer
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-col w-full p-5 mt-8 border border-divider-gray rounded-big">
          <div className="flex items-center justify-between w-full">
            <p className="text-h5 text-[#364253]">Unlimited Approvals</p>
            <Toggle
              enabled={unlimitedApproval}
              setEnabled={setUnlimitedApproval}
            />
          </div>
          <p className="text-text-gray mt-3 text-xs tracking-normal leading-4.5">
            If you do not want to keep approving for each transaction, enable
            this box.
          </p>
        </div>
      </ModalWrapper>
    </Modal>
  );
};

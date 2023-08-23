import { OpenInNewIcon } from "@svg";

export const ViewTxLink = ({ txLink }: { txLink: string }) => {
  return (
    <a
      className="flex"
      target="_blank"
      rel="noopener noreferrer nofollow"
      href={txLink}
    >
      <span className="inline-block">View transaction</span>
      <OpenInNewIcon className="w-4 h-4 ml-2" fill="currentColor" />
    </a>
  );
};

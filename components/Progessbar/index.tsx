export const ProgressBar = ({ value }: { value: number | string }) => {
  return (
    <div className="w-full my-2 rounded-full bg-[#CEEBED]">
      <div
        className="max-w-full py-1 rounded-full bg-[#21AD8C] min-w-5"
        style={{ width: `${parseFloat(value.toString()) * 100}%` }}
      ></div>
    </div>
  );
};

type LoaderProps = {
  size ?:string
}
const Loader = ({ size }: LoaderProps) => (
  <div className="flex-center w-full">
    <img
      src="/assets/icons/loader.svg"
      alt="loader"
      width={size? size: 24}
      height={size? size: 24}
      className="animate-spin"
    />
  </div>
);

export default Loader;

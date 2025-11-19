interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return <div className="h-screen flex justify-center items-center">{children}</div>;
};

export default Layout;

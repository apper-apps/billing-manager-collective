import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Billing Manager
              </h1>
              <p className="text-sm text-slate-600 hidden sm:block">
                Streamline your invoice management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System Online
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
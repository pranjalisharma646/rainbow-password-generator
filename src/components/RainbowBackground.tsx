const RainbowBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen rainbow-gradient">
      <div className="min-h-screen bg-black/10">
        {children}
      </div>
    </div>
  );
};

export default RainbowBackground;

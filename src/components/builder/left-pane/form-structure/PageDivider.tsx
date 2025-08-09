const PageDivider = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      <span className="text-xs font-medium text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
    </div>
  );
};

export default PageDivider;
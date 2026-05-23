
const UserListItem = ({ user, handleFunction }) => {
    return (
        <div
            onClick={handleFunction}
            className="w-full flex items-center gap-3 p-3 mb-2 rounded-xl bg-slate-900/40 border border-slate-800/40 hover:bg-gradient-to-r hover:from-slate-800/80 hover:to-slate-800/30 hover:border-cyan-500/30 cursor-pointer transition-all duration-200 group"
        >
            {/* User Avatar Node */}
            <img
                src={user.pic}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-700 group-hover:border-cyan-500/40 transition-colors"
            />

            {/* Identity Metadata text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                    {user.name}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                    <span className="font-medium text-slate-400">Email: </span>
                    {user.email}
                </p>
            </div>
        </div>
    );
};

export default UserListItem;

const OptionInput = ({
	value,
	onChange,
	onRemove,
	placeholder = "Option",
	canRemove = true,
}) => {
	return (
		<div className="flex items-center gap-2">
			<input
				type="text"
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
			/>
			{canRemove ? (
				<button
					type="button"
					onClick={onRemove}
					className="rounded-2xl border border-white/10 px-3 py-3 text-sm text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-200"
				>
					Remove
				</button>
			) : null}
		</div>
	);
};

export default OptionInput;

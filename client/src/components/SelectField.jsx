export default function SelectField({
    label,
    name,
    value,
    onChange,
    options
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-green-900 mb-1">
                {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-white/50 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-800 cursor-pointer transition-all appearance-none"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

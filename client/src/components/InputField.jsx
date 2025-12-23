export default function InputField({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-green-900 mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 bg-white/50 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none placeholder-gray-400 transition-all text-gray-800"
            />
        </div>
    );
}

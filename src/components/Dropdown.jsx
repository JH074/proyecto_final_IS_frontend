
function Dropdown({ label, options, value, onChange }) {
    return (
        <div className="w-full pb-4 ">
            {label && <label className=" text-white label">
                <span className="label-text">{label}</span>
            </label>}
            <select
                className="select select-bordered w-full bg-white text-black"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option disabled value="">
                    -- Selecciona --
                </option>
                {options.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Dropdown;
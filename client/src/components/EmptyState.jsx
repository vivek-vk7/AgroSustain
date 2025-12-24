const EmptyState = ({ message, icon }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <div className="text-6xl mb-4 text-green-200">
                {icon || '🍃'}
            </div>
            <p className="text-xl font-bold text-green-800 tracking-wide">{message || 'Nothing found here.'}</p>
        </div>
    );
};

export default EmptyState;

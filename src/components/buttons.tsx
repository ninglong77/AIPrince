

export function PrimaryButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void, className?: string }) {
    return <Button onClick={onClick} className={`bg-blue-600 hover:bg-blue-700 text-white ${className || ''}`}>{children}</Button>
}
export function Button({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void, className?: string }) {
    return <button className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className || ''}`} onClick={onClick}>
        {children}
    </button>
}

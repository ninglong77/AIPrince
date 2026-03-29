

export function PrimaryButton({ children, onClick, className, disabled }: { children: React.ReactNode; onClick?: () => void, className?: string, disabled?: boolean }) {
    return <Button disabled={disabled} onClick={onClick} className={`bg-blue-600 hover:bg-blue-700 text-white ${className || ''}`}>{children}</Button>
}
export function Button({ children, onClick, className, disabled }: { children: React.ReactNode; onClick?: () => void, className?: string, disabled?: boolean }) {
    return <button disabled={disabled} className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className || ''} ${disabled ? ' opacity-50 cursor-not-allowed' : ''}`} onClick={onClick}>
        {children}
    </button>
}

export function PrimaryTextButton({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
    return <button className={`cursor-pointer text-blue-600 hover:text-blue-700 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className || ''}`} onClick={onClick}>{children}</button>
}

export function DangerButton({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
    return <button className={`cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className || ''}`} onClick={onClick}>{children}</button>
}

export function DangerTextButton({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
    return <button className={`cursor-pointer text-red-600 hover:text-red-700 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className || ''}`} onClick={onClick}>{children}</button>
}

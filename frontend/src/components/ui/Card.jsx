export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`glass-strong rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

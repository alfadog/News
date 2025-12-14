interface Props {
  title?: string;
  message: string;
}

export function ErrorCard({ title = 'Content unavailable', message }: Props) {
  return (
    <div className="block" style={{ border: '1px solid #e53e3e', background: '#fff5f5' }}>
      <h3 style={{ color: '#c53030', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}

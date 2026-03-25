export default function InfoCard({ title, value, description, icon }) {
  return (
    <div className='info-card'>
      <h4>{icon ? `${icon} ${title}` : title}</h4>
      <p>{description || value}</p>
      {value && <strong>{value}</strong>}
    </div>
  );
}

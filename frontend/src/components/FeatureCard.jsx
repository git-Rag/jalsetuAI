export default function FeatureCard({ title, description, image }) {
  return (
    <article className='feature-card'>
      <div className='feature-image' style={{ backgroundImage: `url(${image})` }} />
      <div className='feature-body'>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </article>
  );
}

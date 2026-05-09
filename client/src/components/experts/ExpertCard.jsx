import { Link } from "react-router-dom";

function ExpertCard({ expert }) {
  return (
    <article className="expert-card">
      <div className="expert-card-header">
        <div className="expert-avatar" aria-hidden="true">
          {expert.name.charAt(0)}
        </div>
        <div>
          <p className="card-kicker">{expert.category}</p>
          <h2>{expert.name}</h2>
        </div>
      </div>
      <p className="expert-meta">
        {expert.experience} years experience - Rating {expert.rating?.toFixed(1) || "0.0"}
      </p>
      <Link className="primary-button" to={`/experts/${expert._id}`}>
        View availability
      </Link>
    </article>
  );
}

export default ExpertCard;

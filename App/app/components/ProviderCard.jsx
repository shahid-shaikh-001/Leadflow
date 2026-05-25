export default function ProviderCard({ provider }) {
  return (
    <div className="card providerCard">
      <div className="providerHeader">
        <div>
          <h3>{provider.name}</h3>
          <p>{provider.leadsReceived} leads received</p>
        </div>

        <span className="quota">Quota: {provider.remainingQuota}</span>
      </div>

      <div className="leadList">
        {provider.assignedLeads.length === 0 ? (
          <p className="emptyText">No leads assigned yet.</p>
        ) : (
          provider.assignedLeads.map((lead) => (
            <div className="leadItem" key={lead.assignmentId}>
              <strong>{lead.customerName}</strong>
              <p>📞 {lead.phone}</p>
              <p>📍 {lead.city}</p>
              <p>🛠 {lead.serviceType.replace("_", " ")}</p>
              <p>{lead.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
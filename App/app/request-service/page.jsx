import ServiceForm from "../components/ServiceForm";

export default function RequestServicePage() {
  return (
    <main className="page">
      <div className="pageHeader">
        <h1>Request a Service</h1>
        <p>
          Submit a customer enquiry. The system will automatically assign this
          lead to exactly 3 providers.
        </p>
      </div>

      <div className="formWrapper">
        <ServiceForm />
      </div>
    </main>
  );
}
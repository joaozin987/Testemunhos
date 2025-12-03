import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ padding: "80px", textAlign: "center" }}>
      <h1>404</h1>
      <p>Página não encontrada</p>
      <Link to="/">Voltar para Home</Link>
    </div>
  );
}

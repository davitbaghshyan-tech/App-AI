import Link from "next/link"
import "../create.css"
import Hero from "./Hero"
import Form from "./Form"

export default function Page() {
  return (
    <section className="create">
      <Link className="top-link" href="/adventures">📚 My Adventures</Link>
      <Hero />
      <Form />
    </section>
  )
}

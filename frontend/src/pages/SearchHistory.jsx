export default function SearchHistory({ searchHistory }) {
  return (
    <section>
      <h3>Search History</h3>
      {searchHistory.length > 0 ? (
        <ul>
          {searchHistory.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      ) : (
        <p>No searches yet.</p>
      )}
    </section>
  )
}

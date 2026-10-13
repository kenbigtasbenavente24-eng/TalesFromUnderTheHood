"use client";

export default function DeleteButton({ id, action }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this message permanently?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="del" type="submit">
        Delete
      </button>
    </form>
  );
}

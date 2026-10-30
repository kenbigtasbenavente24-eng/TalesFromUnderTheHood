"use client";

export default function DeleteButton({
  id,
  action,
  confirmText = "Delete this message permanently?",
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="del" type="submit">
        Delete
      </button>
    </form>
  );
}

import EditorPage from "../editor-page";

export default function ProductEditor({ params }: { params: { id: string } }) {
  return <EditorPage id={params.id} />;
}

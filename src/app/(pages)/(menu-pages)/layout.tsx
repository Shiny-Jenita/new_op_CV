import PageWrapper from "@/components/layout/PageWrapper";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageWrapper>{children}</PageWrapper>
    </>
  );
}

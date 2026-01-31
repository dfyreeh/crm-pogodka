export default function NoAccessPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Доступ заборонено</h1>
        <p className="text-lg text-muted-foreground">
          У вас немає прав для перегляду цієї сторінки.
        </p>
      </div>
    </div>
  );
}

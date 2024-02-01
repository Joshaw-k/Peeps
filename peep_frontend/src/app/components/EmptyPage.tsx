interface IEmptyPageProps {
  icon?: any;
  text: string;
  children?: any;
}

export const EmptyPage = ({ icon, text, children }: IEmptyPageProps) => {
  return (
    <section className="hero min-h-96 card dark:bg-base-100">
      <div className="hero-content flex-col">
        <div>
          {/* - Bounce animation */}
          {icon}
        </div>
        <div>{text}</div>
        {children}
      </div>
    </section>
  );
};

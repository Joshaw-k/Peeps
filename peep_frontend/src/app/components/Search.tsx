"use client";

export const Search = () => {
  return (
    <section className={""}>
      <div className="join w-full">
        <div className="w-full">
          <input
            className="input input-bordered w-full px-6 py-6 border-0 bg-base-200 rounded-box join-item focus:bg-base-300 transition-[colors, outline]"
            placeholder="Search"
          />
        </div>

        {/* <div className="indicator">
          <span className="indicator-item badge badge-secondary">new</span>
          <button className="btn join-item">Search</button>
        </div> */}
      </div>
      {/* <select className="select select-bordered">
        <option disabled selected>
          Filter
        </option>
        <option>Sci-fi</option>
        <option>Drama</option>
        <option>Action</option>
      </select> */}
    </section>
  );
};

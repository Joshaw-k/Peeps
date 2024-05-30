"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const Search = () => {
  const [searchText, setsearchText] = useState<string>("");
  const [usersIpfsHash, setUsersIpfsHash] = useState(null);
  const [usersData, setUsersData] = useState<any>();
  const searchForUser = async () => {
    try {
      const res2 = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[keyvalues]["username"]={"value":"j$","op":"regexp"}&status=pinned`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      // if (res2.data) {
      //   if (res2.data.rows.length > 0) {
      //     let data = [];
      //     for (let index = 0; index < res2.data.rows.length; index++) {
      //       const res3 = await axios.get(
      //         `https://moccasin-many-grasshopper-363.mypinata.cloud/ipfs/${res2.data.rows[index].ipfs_pin_hash}`
      //       );
      //       data.push(res3.data);
      //     }
      //     // data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      //     setUsersData(data);
      //     console.log(data);
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   searchForUser();
  // }, [searchText]);
  return (
    <section className={""}>
      <div className="join w-full">
        <div className="w-full">
          <input
            className="input input-bordered w-full px-6 py-6 border-0 bg-gray-100 dark:bg-base-200 rounded-box join-item focus:bg-base-300 transition-[colors, outline]"
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

"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const Search = () => {
  const [searchText, setsearchText] = useState<string>();
  const [usersIpfsHash, setUsersIpfsHash] = useState(null);
  const [usersData, setUsersData] = useState<any>();
  const searchForUser = async () => {
    try {
      const res2 = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[keyvalues]["username"]={"value":"j$","op":"regexp"}&status=pinned`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjEwODYwOC01YzRhLTQ2MDQtOTJjMi1jNTkyMjg1ZGViNzYiLCJlbWFpbCI6ImF3aW5yaW40Ymxlc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJjYmE4MzNkYmM1MjQyNjFiNjU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGE2ZWMwZDZlNjBmYmI0ZWY5MTdmOTkzMmFjZWEwZGUyNGFjZTU1NDZmYWQyMTNmYThmZTVlY2RhMDI2NDQ0OCIsImlhdCI6MTcxMTkwODAxNX0.3RVKCUnhqQlgvfy9lxmAa1ltR_sLHVhHSZtvNJj7aik`,
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
      console.log(res2);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    searchForUser();
  }, [searchText]);
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

import React from "react";
import { useState, useEffect } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

//offences list functions
//useState to render offence list
export function ShowOffences() {
    const { searching, offences, Serror } = useOffences();
    if (searching) {
        return <div className="loading"></div>
    }

    if (Serror) {
        return <p>Something's wrong: {Serror.message}</p>
    }

    const columns = [{
        Header: "Offences List",
        accessor: '',
        Cell: row => (
            <div style={{ textAlign: "center" }}>{row.value}</div>),
    }]

    return (
        <div className="offence-table">
            <ReactTable
                data={offences}
                columns={columns}
                filterable
                defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row)}
                defaultPageSize={10}
                pageSizeOptions={[10]}
                className="-striped"
            />
            <div className="ocean">
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
        </div>
    )
}

//remove case sensitivtiy in react table during table search
export function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
        row[id] !== undefined ?
            String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
            :
            true
    );
}

//fetch data from offences list in the data backend
function OpenSource() {
    // const url = "https://172.22.30.87/offences"
    const url = "http://13.237.111.17/offences"
    return fetch(url)
        .then((res) => res.json())
        .then((res) => res.offences)

}

//useState function for offence rendering state change
function useOffences() {
    const [searching, SetSearching] = useState(true);
    const [offences, SetOffence] = useState([]);
    const [Serror, setError] = useState(null);
    useEffect(() => {
        OpenSource().then((offences) => {
            SetOffence(offences);
            SetSearching(false);
        }).catch((e) => {
            setError(e);
            SetSearching(false);
        })
    }, []);

    return {
        searching,
        offences,
        Serror,
    };
}
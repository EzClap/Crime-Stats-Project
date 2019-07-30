import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { filterCaseInsensitive } from "./offences";
import { Doughnut } from 'react-chartjs-2';
import GoogleMapReact from 'google-map-react';

//map marker component
const AnyReactComponent = ({ text }) => <div>{text}</div>;

//Advanced search class
class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            offsearch: "",
            areasearch: "",
            agesearch: "",
            gendersearch: "",
            yearsearch: "",
            monthsearch: "",
            results: [],
            chartData: {},
            options: {},
            GPS: [],
            heatMapdata: {},
            updated: false,
        }
        //Binding method to this class
        this.changeOff = this.changeOff.bind(this);
        this.changeArea = this.changeArea.bind(this);
        this.optionAge = this.optionAge.bind(this);
        this.optionGender = this.optionGender.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.Buttons = this.Buttons.bind(this);



    }
    //Setting input box items into Search filters
    changeOff(event) {
        this.setState({ offsearch: event.target.value });
    }
    changeArea(event) {
        this.setState({ areasearch: event.target.value });
    }
    optionAge(event) {
        this.setState({ agesearch: event.target.value });
    }
    optionGender(event) {
        this.setState({ gendersearch: event.target.value });
    }
    changeYear(event) {
        this.setState({ yearsearch: event.target.value });
    }
    changeMonth(event) {
        this.setState({ monthsearch: event.target.value });
    }

    //Turn Search data into processable chartData
    //Coloring Doughnut chart
    getChartData() {
        let area = this.state.results.map((area) => {
            return (area.LGA)
        })
        let numbers = this.state.results.map((number) => {
            return (number.total)
        })
        let rColor = [];
        let rHighlight = [];
        for (var i in area) {
            let r = Math.floor(Math.random() * 200);
            let g = Math.floor(Math.random() * 200);
            let b = Math.floor(Math.random() * 200);
            let c = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            let h = 'rgb(' + (r + 20) + ', ' + (g + 20) + ', ' + (b + 20) + ')';
            rColor[i] = c;
            rHighlight[i] = h;
        }
        this.setState({
            chartData: {
                labels: area,
                datasets: [{
                    label: 'Crime Stats in Pie Chart',
                    data: numbers,
                    backgroundColor: rColor,
                    highlight: rHighlight,
                }],

            },
        })
    }
    //Get search result from API then organise into states for updates
    fetchdata = () => {
        let key = sessionStorage.getItem("token");
        let getParam = { method: "GET" };
        let head = { Authorization: `Bearer ${key}` };

        getParam.headers = head;

        
        // const baseUrl = "https://172.22.30.87/search?";
        const baseUrl = "http://13.237.111.17/search?";
        const query = "offence=" + this.state.offsearch;
        const filterlga = "area=" + this.state.areasearch;
        const filterage = "age=" + this.state.agesearch;
        const filtergender = "gender=" + this.state.gendersearch;
        const filteryear = "year=" + this.state.yearsearch;
        const filtermonth = "month=" + this.state.monthsearch;

        let url = baseUrl + query + "&" + filterlga + "&" + filterage + "&" + filtergender + "&" + filteryear + "&" + filtermonth;

        fetch(encodeURI(url), getParam)
            .then(result => {
                return (result.json());
            })
            .then(data => {
                //Fill in data for the table 
                let results = data.result.map((off) => {
                    return ({
                        LGA: off.LGA,
                        total: off.total
                    })
                })
                //Fill in data for Heat map 
                let GPS = data.result.map((latlng) => {
                    return ({
                        lat: latlng.lat,
                        lng: latlng.lng,
                        weight: latlng.total,
                    })
                })
                let nozero = [];
                for (var i = 0; i < results.length; i++){
                    if(results[i].total !== 0){
                        nozero.push(results[i]);
                    }
                }
                let gpsNozero = [];
                for (var i = 0; i < GPS.length; i++){
                    if(GPS[i].weight !== 0){
                        gpsNozero.push(GPS[i]);
                    }
                }
                this.setState({ results: nozero })
                this.setState({ GPS: gpsNozero })
            })
            .then(
                //Clear Map for re-rendering later
                //Heatmap is not updated dynamically
                this.setState({
                    updated: false,
                })
            )
            .catch(function (error) {
                console.log(
                    "There has been a problem with your fetch operation: ",
                    error.message
                );
            });
    }
    //Update and Show Heat Map 
    updateHeatmap() {
        this.setState({
            updated: true,
            heatMapdata: {
                positions: this.state.GPS,
                options: {
                    radius: 50,
                    opacity: 0.8,
                }
            }
        })
    }
    //All buttons for filtering API
    Buttons() {
        return (
            <div className="all-filters">
                <div className="filter-btns">
                    <input
                        className="filter-input-offence"
                        name="offence"
                        id="offence"
                        type="offence"
                        placeholder="Search Offence (Required)"
                        value={this.state.offsearch}
                        onChange={this.changeOff}
                    />

                    <input
                        className="filter-input"
                        name="lga"
                        id="lga"
                        type="lga"
                        placeholder="Search Location"
                        value={this.state.areasearch}
                        onChange={this.changeArea}
                    />

                    <select className="age-option" id="age" value={this.state.agesearch} onChange={this.optionAge}>
                        <option value="">Age</option>
                        <option value="Adult">Adult</option>
                        <option value="Juvenile">Juvenile</option>
                    </select>

                    <select className="sex-option" id="sex" value={this.state.gendersearch} onChange={this.optionGender}>
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Not Stated">Not Stated</option>
                    </select>

                </div>
                <div className="yearmonth-filter">
                    <input
                        className="filter-input-yearmonth"
                        name="year"
                        id="year"
                        type="year"
                        placeholder="2003,2005 (Year: 2001-2019)"
                        value={this.state.yearsearch}
                        onChange={this.changeYear}
                    />
                    <input
                        className="filter-input-yearmonth"
                        name="month"
                        id="month"
                        type="month"
                        placeholder="1,3,5,4 (Month: 1-12)"
                        value={this.state.monthsearch}
                        onChange={this.changeMonth}
                    />
                </div>
                <div className="filter-click">
                    <button className="search-btn" id="search-button" type="button" onClick={this.fetchdata}>Search</button>
                    <button className="search-btn" id="show-graph" type="button" onClick={this.getChartData.bind(this)}>Update Graph Result</button>
                    <button className="search-btn" id="update-map" type="button" onClick={this.updateHeatmap.bind(this)}>Update Map Result</button>
                </div>
            </div>
        );
    }
    //Rendering according to map update
    render() {
        if (sessionStorage.getItem("token") !== null) {
            if (!this.state.updated) {
                return (
                    <div className="search-page">
                        {this.Buttons()}
                        {/*This is table implementation*/}
                        <div className="search-table">
                            <ReactTable
                                data={this.state.results}
                                columns={[
                                    {
                                        Header: "LGA",
                                        accessor: "LGA",
                                        width: 300,
                                        Cell: row => (
                                            <div style={{ textAlign: "center" }}>{row.value}</div>),

                                    }, {
                                        Header: "Total Number",
                                        accessor: "total",
                                        width: 150,
                                        Cell: row => (
                                            <div style={{ textAlign: "center" }}>{row.value}</div>),
                                    }
                                ]}
                                filterable
                                defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row)}
                                defaultPageSize={10}
                                pageSizeOptions={[10]}
                                className="-short"
                            />
                        </div>
                        {/*This is Graph implementation*/}
                        <div className="clear-float">
                            <div className="chart-display">
                                {console.log(this.state.chartData)}
                                <Doughnut data={this.state.chartData}
                                    options={{
                                        title: {
                                            display: true,
                                            text: "Crime Stats In Queensland",
                                            fontSize: 30,
                                        },
                                        legend: {
                                            display: false
                                        },

                                    }} />
                            </div>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div className="search-page">
                        {this.Buttons()}
                        {/*This is table implementation*/}
                        <div className="search-table">
                            <ReactTable
                                data={this.state.results}
                                columns={[
                                    {
                                        Header: "LGA",
                                        accessor: "LGA",
                                        width: 300,
                                        Cell: row => (
                                            <div style={{ textAlign: "center" }}>{row.value}</div>),

                                    }, {
                                        Header: "Total Number",
                                        accessor: "total",
                                        width: 150,
                                        Cell: row => (
                                            <div style={{ textAlign: "center" }}>{row.value}</div>),
                                    }
                                ]}
                                filterable
                                defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row)}
                                defaultPageSize={10}
                                pageSizeOptions={[5, 10, 20, 40]}
                                className="-short"
                            />
                        </div>
                        {/*This is graph implementation*/}
                        <div className="clear-float">
                            <div className="chart-display">
                                <Doughnut data={this.state.chartData}
                                    options={{
                                        title: {
                                            display: true,
                                            text: "Crime Stats In Queensland",
                                            fontSize: 30,
                                        },
                                        legend: {
                                            display: false
                                        },

                                    }} />
                            </div>
                        </div>

                        {/*This is map implementation*/}
                        <div className="heat-map" style={{ height: '50vh', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyDzZe3mc2opzmbZavOC5j335M216rWgqEY' }}
                                center={[-22.9176, 146.7028]}
                                zoom={5.2}
                                heatmapLibrary={true}
                                heatmap={this.state.heatMapdata}
                            >
                                <AnyReactComponent
                                    lat={-27.4698}
                                    lng={153.0251} />
                            </GoogleMapReact>
                        </div>
                    </div>
                );
            }
        }
        else {
            return (
                <div className="access-denied">
                    <h1>YOUR ACCESS TO AUTHORIZED DATA IS DENIED.</h1>
                    <h1>PLEASE SIGN IN OR CONTACT SYSTEM ADMIN.</h1>
                </div>
            )
        }
    }
}

export { Search }
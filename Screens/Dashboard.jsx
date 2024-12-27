import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {useState, useEffect} from 'react';
import {ButtonAnimatedWithLabel} from '../CommonComponents/ButtonAnimated';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-reanimated-table';
import {Dimensions} from 'react-native';

/*
    Things to see
    - See last 1 month's consumption
    - See all time consumptions 
    - See the average consumption
*/

function TitleLine(){
    //line that goes under the title of the page
    return(
        <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, width: 200, marginBottom: 10}}/>
    )
}

function epoch2Date(epoch){
    //converts epoch to date
    //epoch is in ms 
    var date = new Date(epoch);
    return date.toDateString();
}

function ConsumptionTable({data, displayUnits='kWh'}){
    //returns a table component
    /*
        Data:
            [
                [ 1, 1001, 1711218660, 230, 5.2, 1196, 25.6, 50, 0.98 ],
                [ 2, 1001, 1711305060, 228, 5.3, 1208, 26.1, 49.8, 0.97 ]
            ]

            Row: logID, meterID, TimeStamp, Voltage, Current, Energy, WattHour, Frequency, PowerFactor

            We only need: TimeStamp, WattHour (kiloWatthour) in a table

    */
        
    var tableData = {};
    console.log("data is")
    console.log(data.billTable);

    tableData.head = Object.keys(data.billTable[0]);
    let _tmp = data.billTable.slice(0, data.billTable.length-1);
    tableData.data = _tmp.map(row => Object.values(row));
    tableData.data.push(["Total (Rs)", "", "", data.billTable[data.billTable.length-1].total]);

    return(
        <Table>
            <Row data={tableData.head} style={styles.head} textStyle={styles.text}/>
            <Rows data={tableData.data} style={styles.row} textStyle={styles.text}/>
        </Table>
    )

}

export default function Dashboard({navigation, route}) {
    const {meterID, password, apiRoute} = route.params;
    const [data, setData] = useState(null);
    const [isDataSet, setIsDataSet] = useState(false);
    const [isError, setIsError] = useState(false);
    const [displayUnits, setDisplayUnits] = useState('Wh');

    async function GetFromAPI(path, authObject){
        // authObject = {meterID, password} --> Set password in header
        // path = apiRoute/something/somethingElse
        // returns the data from the api
    
        fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'password': authObject.password,
                'meterID': authObject.meterID
            }
        }).then(response => {
            if (response.ok) {
                console.log("Data retrieved successfully")
                response.json().then(data => {
                    console.log("data is")
                    console.log(data);
                    setData(data);
                });
            } else {
                console.log("Data retrieval failed")
                setIsError(true);
                return null;
            }
        }).catch(error => {
            console.log("Error: ", error);
            setIsError(true);
            return null;
        });
    }

    const Get2MonthsConsumptionClickHandler = () => {
        // get the last 2 months consumption
        console.log("Last 2 months consumption")
        const epochNow = Date.now()
        const epochTwoMonthsAgo = epochNow - 1000*60*60*24*30*2;

        ////log-data/ranged/:deviceID/:epochStart/:epochEnd

        var path = `${apiRoute}/bill/${meterID}/${epochTwoMonthsAgo}/${epochNow}`

        var authObject = {meterID, password}
        GetFromAPI(path, authObject);
    }

    const Get1MonthsConsumptionClickHandler = () => {
        // get all time consumption
        console.log("Last 1 month consumption")
        const epochNow = Date.now()
        const epochTwoMonthsAgo = epochNow - 1000*60*60*24*30;

        ////log-data/ranged/:deviceID/:epochStart/:epochEnd

        var path = `${apiRoute}/bill/${meterID}/${epochTwoMonthsAgo}/${epochNow}`

        var authObject = {meterID, password}
        GetFromAPI(path, authObject);
    }

    useEffect(() => {
        if(data !== null){
            console.log("Data is set")
            setIsDataSet(true);
        }
        else{
            console.log("Data is not set")
        }
    }, [data])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meter Dashboard</Text>        
            <TitleLine/>

            <View style={styles.scrollViewContainer}>
                <ScrollView contentContainerStyle={styles.consumptionContainer}>
                    {isDataSet && <ConsumptionTable data={data} displayUnits={displayUnits}/>}
                    {isError && <Text style={styles.text}>Error: Could not retrieve data</Text>}
                </ScrollView>
            </View>

            {/* Buttons Container At the Bottom of the page */}
            <View style={styles.ButtonsContainer}>
                <ButtonAnimatedWithLabel 
                    style={styles.ButtonStyle} 
                    styleText={styles.ButtonTextStyle} 
                    label="Last 2 months Consumption" 
                    onPress={Get2MonthsConsumptionClickHandler}
                />
                <ButtonAnimatedWithLabel 
                    style={styles.ButtonStyle} 
                    styleText={styles.ButtonTextStyle} 
                    label="Last 1 month Consumption" 
                    onPress={Get1MonthsConsumptionClickHandler}
                />

                {/* <ButtonAnimatedWithLabel style={styles.ButtonStyle} label="Average" onPress={() => console.log("Average consumption")}/> */}
            </View>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        width: windowWidth,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 50,
    },
    ButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 50,
        flexDirection: 'column',
    },
    consumptionContainer: {
        flex: 0,
        justifyContent: 'flex-start',
        width: Math.floor(windowWidth*0.9),
    },
    scrollViewContainer:{
        height: Math.floor(windowHeight*0.7),
    },
    ButtonStyle:{
        
    },
    ButtonTextStyle:{
        fontSize: 16,
        textAlign: 'center',
    },

    text: { margin: 6 },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    row: { height: 30 },
    errorText: {
        color: 'red',
        fontSize: 16,
    }
});
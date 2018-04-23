import { StyleSheet } from "react-native"

export default StyleSheet.create({
    infoCard: {
        margin: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        borderWidth: 2
    },
    characterCard: {
        borderColor: "rgb(244, 220, 66)",
        backgroundColor: "rgba(69, 62, 59, 0.5)"
    },
    memberName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    subTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
        marginRight: 10,
    },
    statsBox: {
        margin: 5,
        padding: 5
    },
    statCard: {
        margin: 5,
        padding: 5,
        backgroundColor: "#707070",
        borderColor: "#efb20b",
        borderWidth: 1
    },
    subSection: {
        color:"#efb20b",
        fontSize: 20,
        fontWeight: "bold",
        backgroundColor: "#3521201e",
        padding: 10,
        textAlign: "center"
    }
})

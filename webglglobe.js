var list = [];
var ref_set = new Firebase('https://firstproject-a737a.firebaseio.com/location_conversion_data');
ref_set.on('value', function (snapshot) {

    var data = snapshot.val();
    for (var key in data) {
        list.push(data[key]);
    }
    list = "["+list+"]";
    list = list.toString();
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}
else {
    var container = document.getElementById('container_3d');
    var globe = new DAT.Globe(container);
    var data = JSON.parse(list);
    globe.addData(data, { format: 'magnitude' });
    // console.log("data: " + data);

    globe.createPoints();
    globe.animate();


}
});
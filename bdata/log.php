<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
define('ROOT_PATH', dirname(__FILE__));
do{
    $file = ROOT_PATH."/log/".date("YmdHis").".txt";
    file_put_contents($file,date("Y-m-d H:i:s"));
    sleep(5*60);
} while(true)
?>
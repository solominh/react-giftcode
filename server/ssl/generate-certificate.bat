openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out ca.key
openssl req -new -x509 -days 360 -key ca.key -subj "/CN=Test CA/O=AAAAA Test Organization" -out ca.crt
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out server.key
openssl req -new -key server.key -subj "/CN=solominh.com/O=AAAA Test Organization" -out server.csr
openssl x509 -days 360 -req -in server.csr -CAcreateserial -CA ca.crt -CAkey ca.key -out server.crt

/**
 * This file is only needed for docker build. It is suppose to
 * create database file so that you can mount it in your file
 * system when creating conatiner with `docker-comose`. Otherwise
 * when we try to create it docker will create `database.db` directory
 * since file wouldnt exist at this point
 *
 * @author Filip Izydorczyk
 */

import { getDatabase } from "@tmp/back/db";

const db = getDatabase();
db.close();

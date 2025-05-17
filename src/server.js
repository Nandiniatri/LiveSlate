import { createServer } from "miragejs";

export function makeServer({ environment = "development" } = {}){
    let server = createServer({
        environment,

        fixtures:{

        },

        routes() {
            this.namespace = "api";

            this.get("/header" , (schema) => {
                return schema.db.header;
            })
        }
    })
}
<template>
    <b-container class="contacts-list pt-3">
        <h1 class="text-center">Contacts List</h1>
        <b-row align-h="end">
            <b-col cols="6">
                <b-input-group prepend="Search" class="mt-3 mb-3">
                    <b-form-input id="input-search" placeholder="Search By Name or Phone" v-model="search"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="outline-primary" @click="onSearchClicked">
                            <b-icon-search />
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
        </b-row>
        
        <b-table show-empty striped hover :items="items" :fields="fields" id="contacts-table">
            <template #cell(action)="row">
                <div class="text-center">
                    <b-button variant="info" class="mr-1" @click="onEditClicked(row.item)">Edit</b-button>
                </div>
            </template>
        </b-table>

        <b-modal id="contact-modal" title="Update Contact" hide-footer>
            <b-form>
                <b-form-group label="Your Name:" label-for="input-name">
                    <b-form-input
                        id="input-name"
                        v-model="item.name"
                        required
                        placeholder="Enter name"
                    ></b-form-input>
                </b-form-group>

                <b-form-group label="Your Phone no:" label-for="input-phone">
                    <b-form-input
                        id="input-phone"
                        v-model="item.phone"
                        required
                        placeholder="Enter Phone Number"
                    ></b-form-input>
                </b-form-group>
            </b-form>

            <div class="text-right pt-2">
                <b-button class="mr-2" @click="$bvModal.hide('contact-modal')">Cancel</b-button>
                <b-button variant="success" @click="onUpdateClicked">Update</b-button>
            </div>
        </b-modal>

        <b-pagination
            v-model="currentPage"
            :total-rows="totalCount"
            :per-page="perPage"
            aria-controls="contacts-table"
            align="center"
            @page-click="onPageClicked"
        ></b-pagination>
    </b-container>
</template>

<script>
import { BIconSearch } from 'bootstrap-vue'
import contactsAPI from '../api/contacts-api'

export default {
    name: 'Contacts',
    components: {
        BIconSearch
    },
    data() {
        return {
            fields: [
                {
                    key: 'name',
                    sortable: true
                }, {
                    key: 'phone',
                    sortable: false
                }, { 
                    key: 'action', 
                    label: 'Action',
                    thStyle: {
                        width: '100px'
                    }
                }
            ],
            items: [],
            item: {
                id: 0,
                name: '',
                phone: ''
            },
            perPage: 20,
            currentPage: 1,
            totalCount: 0,
            search: '',
            modalTitle: 'Add Contact'
        }
    },
    mounted() {
        this.getListsPerPage(this.currentPage);
    },
    methods: {
        getListsPerPage: function(page) {
            let _this = this;

            let params = {
                page: page,
                search: _this.search
            };

            contactsAPI.list(params, (data) => {
                _this.items = data.data;
                _this.currentPage = data.current_page;
                _this.totalCount = data.total_count;
            }, (error) => {
                console.log(error);
            });
        },
        onPageClicked: function(btEvt, page) {
            this.getListsPerPage(page);
        },
        onSearchClicked: function() {
            this.getListsPerPage(1);
        },
        onEditClicked: function(item) {
            this.item = JSON.parse(JSON.stringify(item));
            this.$bvModal.show('contact-modal');
        },
        onUpdateClicked: function() {
            let _this = this;

            let params = {
                name: this.item.name,
                phone: this.item.phone
            }

            contactsAPI.update(_this.item.id, params, () => {
                _this.items.forEach(item => {
                    if(item.id == _this.item.id) {
                        item.name = _this.item.name,
                        item.phone = _this.item.phone
                    }
                });

                _this.$bvModal.hide('contact-modal');
            }, (error) => {
                console.log(error);
            })
        }
    }
}
</script>
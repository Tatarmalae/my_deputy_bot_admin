<template>
  <div>
    <b-input-group size='sm'>
      <b-pagination :total-rows='totalRows' :per-page='perPage' v-model='currentPage' class='my-0 pagination-sm' />
      <b-form-input
        id='filter-input'
        v-model='filter'
        type='search'
        placeholder='Type to Search'
      ></b-form-input>
      <b-button-group class='ml-auto'>
        <b-button size='sm' variant='outline-success' @click='modalAdd'>
          <b-icon icon='person-plus' aria-hidden='true'></b-icon>
          Добавить запись
        </b-button>
      </b-button-group>
    </b-input-group>
    <b-table class='table-xsmall'
             ref='table'
             responsive='true'
             :items='items'
             :fields='fields'
             hover
             sticky-header='calc(100vh - 156px)'
             head-variant='light'
             small
             @row-hovered='rowHovered'
             @row-unhovered='hoveredRow=null'
             :filter='filter'
             :current-page='currentPage'
             :per-page='perPage'
    >
      <!--      <template #cell(phone)='data'>-->
      <!--        <a v-if='data.value' :href="`tel:${data.value.replace(/\D/g, '')}`" target='_blank'>{{ data.value }}</a>-->
      <!--      </template>-->
      <!--      <template #cell(email)='data'>-->
      <!--        <a v-if='data.value' :href='`mailto:${data.value}`' target='_blank'>{{ data.value }}</a>-->
      <!--      </template>-->
      <template #cell(more_about_deputy)='data'>
        <a v-if='data.value' :href='`${data.value}`' target='_blank' v-b-tooltip='{ title: `${data.value}` }'>Перейти</a>
      </template>
      <template v-slot:cell(edit)='row'>
        <div class='mt-2'>
          <b-button-group>
            <b-button size='sm' class='mr-2' variant='outline-primary' @click='modal(row.item, row.index, $event.target)'>
              <b-icon icon='gear-wide' aria-hidden='true' :animation="isHovered(row.item) ? 'spin' : ''"></b-icon>
            </b-button>
            <b-button size='sm' variant='outline-danger' @click='deleteAddress(row.item, row.index)'>
              <b-icon icon='trash' aria-hidden='true'></b-icon>
            </b-button>
          </b-button-group>
        </div>
      </template>
    </b-table>

    <!-- Add modal -->
    <b-modal
      id='modal-add'
      title='Добавление'
      size='lg'
      scrollable
      @show='resetModal'
      @hidde='resetModal'
      @ok='handleOk'
      cancelTitle='Отменить'
      okTitle='Добавить'
    >
      <b-form ref='form' @submit.stop.prevent='handleSubmit'>
        <b-table stacked :items='addItem' :fields='fields'>
          <template v-slot:cell(pp_number)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.pp_number'
            />
          </template>
          <template v-slot:cell(country)='row'>
            <b-form-input
              type='text'
              size='sm'
              v-model='row.item.country'
            />
          </template>
          <template v-slot:cell(uik)='row'>
            <b-form-input
              type='text'
              size='sm'
              v-model='row.item.uik'
            />
          </template>
          <template v-slot:cell(full_name)='row'>
            <b-form-input
              id='name-input'
              type='text'
              size='sm'
              v-model='row.item.full_name'
              :state='nameState'
              @input='row.item.full_name.length > 0 ? nameState=true : nameState=false'
              required
            />
            <b-form-invalid-feedback id='name-input'>Поле обязательно</b-form-invalid-feedback>
          </template>
          <template v-slot:cell(position)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.position'
            />
          </template>
          <template v-slot:cell(receives)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.receives'
            />
          </template>
          <template v-slot:cell(address)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.address'
            />
          </template>
          <template v-slot:cell(phone)='row'>
            <b-form-input
              type='text'
              size='sm'
              v-model='row.item.phone'
            />
          </template>
          <template v-slot:cell(email)='row'>
            <b-form-input
              type='text'
              size='sm'
              v-model='row.item.email'
            />
          </template>
          <template v-slot:cell(more_about_deputy)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.more_about_deputy'
            />
          </template>
        </b-table>
      </b-form>
    </b-modal>

    <!-- Info modal -->
    <b-modal
      :id='infoModal.id'
      :title='infoModal.title'
      size='lg'
      scrollable
      @show="resetModal"
      @hide='resetModal'
      @ok='handleOk'
      cancelTitle='Отменить'
      okTitle='Сохранить'
    >
      <b-form ref='form' @submit.stop.prevent='handleSubmit'>
        <b-table stacked :items='infoModal.content' :fields='fields'>
          <template v-slot:cell(pp_number)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.pp_number'
            />
          </template>
          <template v-slot:cell(country)='row'>
            <b-form-input
              type='text'
              size='sm'
              v-model='row.item.country'
            />
          </template>
          <template v-slot:cell(uik)='row'>
            <b-form-input
              type='text'
              size='sm'
              v-model='row.item.uik'
            />
          </template>
          <template v-slot:cell(full_name)='row'>
            <b-form-input
              id='name-input'
              type='text'
              size='sm'
              v-model='row.item.full_name'
              :state='nameState'
              @input='row.item.full_name.length > 0 ? nameState=true : nameState=false'
              required
            />
            <b-form-invalid-feedback id='name-input'>Поле обязательно</b-form-invalid-feedback>
          </template>
          <template v-slot:cell(position)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.position'
            />
          </template>
          <template v-slot:cell(receives)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.receives'
            />
          </template>
          <template v-slot:cell(address)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.address'
            />
          </template>
          <template v-slot:cell(phone)='row'>
            <b-form-input
              type='text'
              size='sm'
              v-model='row.item.phone'
            />
          </template>
          <template v-slot:cell(email)='row'>
            <b-form-input
              type='text'
              size='sm'
              v-model='row.item.email'
            />
          </template>
          <template v-slot:cell(more_about_deputy)='row'>
            <b-form-textarea
              rows='3'
              no-resize
              size='sm'
              v-model='row.item.more_about_deputy'
            />
          </template>
        </b-table>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import httpClient from '@/services/httpClient';
//TODO: пагинация - https://hohanga.medium.com/bootstrapvue-table-filtering-and-loading-5e4610da341b
//TODO: пагинация -  https://www.codegrepper.com/code-examples/whatever/pagination+in+b+table+in+bootstrap+vue

export default {
  name: 'Address',
  data() {
    return {
      fields: [
        { key: 'pp_number', label: '№ п/п', tdClass: 'fixed_width_large', thClass: 'fixed_width_large' },
        { key: 'country', label: 'Округ', tdClass: 'fixed_width_medium', thClass: 'fixed_width_medium' },
        { key: 'uik', label: 'УИК', tdClass: 'fixed_width_small', thClass: 'fixed_width_small' },
        { key: 'full_name', label: 'Ф.И.О. депутата', tdClass: 'fixed_width_small', thClass: 'fixed_width_small' },
        {
          key: 'position',
          label: 'Должность, место работы',
          tdClass: 'fixed_width_large',
          thClass: 'fixed_width_large'
        },
        { key: 'receives', label: 'Ведет прием', tdClass: 'fixed_width_large', thClass: 'fixed_width_large' },
        { key: 'address', label: 'Адрес', tdClass: 'fixed_width_medium', thClass: 'fixed_width_medium' },
        { key: 'phone', label: 'Телефон', tdClass: 'fixed_width_medium', thClass: 'fixed_width_medium' },
        { key: 'email', label: 'E-mail', tdClass: 'fixed_width_medium', thClass: 'fixed_width_medium' },
        { key: 'more_about_deputy', label: 'Подробнее', tdClass: 'fixed_width_small', thClass: 'fixed_width_small' },
        { key: 'edit', label: '' }
      ],
      items: [],
      addItem: [],
      hoveredRow: null,
      currentPage: 1,
      perPage: 10,
      totalRows: null,
      filter: null,
      infoModal: {
        id: 'info-modal',
        title: '',
        content: []
      },
      nameState: false,
      itemsEditable: [],
      itemsEditableIndex: 0
    };
  },
  mounted() {
    this.getAddress();
  },
  methods: {
    getAddress() {
      httpClient
        .get('/api/address/')
        .then((result) => {
          this.items = result;
          this.totalRows = JSON.parse(JSON.stringify(result)).length;
        })
        .catch();
    },
    rowHovered(items) {
      this.hoveredRow = items;
    },
    isHovered(item) {
      return item === this.hoveredRow;
    },
    modal(item, index, button) {
      this.itemsEditable = JSON.parse(JSON.stringify(item));
      this.infoModal.title = `${this.itemsEditable.full_name}`;
      this.infoModal.content = [this.itemsEditable];
      this.itemsEditableIndex = index + (this.currentPage - 1) * this.perPage;
      this.$root.$emit('bv::show::modal', this.infoModal.id, button);
    },
    modalAdd(button) {
      this.addItem = [{
        address: '',
        country: '',
        email: '',
        full_name: '',
        more_about_deputy: '',
        phone: '',
        position: '',
        pp_number: '',
        receives: '',
        uik: ''
      }];
      this.$root.$emit('bv::show::modal', 'modal-add', button);
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit(bvModalEvt);
    },
    handleSubmit(bvModalEvt) {
      if (!this.checkFormValidity()) {
        return;
      }
      this.$nextTick(() => {
        if (bvModalEvt['componentId'] === 'modal-add') {
          this.$bvModal.hide('modal-add');
          this.addAddress(this.addItem[0]);
        } else {
          this.$bvModal.hide(this.infoModal.id);
          this.updateAddress(this.infoModal.content[0]);
        }
      });
    },
    async updateAddress(item) {
      await httpClient
        .put('/api/address/' + item.id, item)
        .then(() => {
          this.items.splice(this.itemsEditableIndex, 1, this.itemsEditable);
        })
        .catch();
    },
    async addAddress(item) {
      await httpClient
        .post('/api/address/', item)
        .then(() => {
          this.getAddress();
        })
        .catch();
    },
    async deleteAddress(item, index) {
      this.itemsEditableIndex = index + (this.currentPage - 1) * this.perPage;
      if (confirm('Вы уверены?')) {
        await httpClient
          .delete('/api/address/' + item.id)
          .then(() => {
            this.items.splice(this.itemsEditableIndex, 1);
          })
          .catch();
      }
    }
  }
};
</script>
<style scoped>
.form-control {
  flex: 0 0 300px !important;
}
/deep/ .table-xsmall {
  text-align: left;
}
/deep/ .table-xsmall tr th {
  font-size: 0.9rem;
}
/deep/ .table-xsmall td {
  font-size: 0.8rem;
}
/deep/ .table-xsmall td.fixed_width_large,
/deep/ .table-xsmall th.fixed_width_large {
  min-width: 250px;
  max-width: 250px;
  word-wrap: break-word;
}
/deep/ .table-xsmall td.fixed_width_medium,
/deep/ .table-xsmall th.fixed_width_medium {
  min-width: 170px;
  max-width: 170px;
  word-wrap: break-word;
}
/deep/ .table-xsmall th.fixed_width_small,
/deep/ .table-xsmall td.fixed_width_small {
  min-width: 100px;
  max-width: 100px;
  word-wrap: break-word;
}
</style>
